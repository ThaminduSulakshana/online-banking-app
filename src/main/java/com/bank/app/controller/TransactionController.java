package com.bank.app.controller;

import com.bank.app.entity.Account;
import com.bank.app.entity.Transaction;
import com.bank.app.entity.TransactionStatus;
import com.bank.app.entity.TransactionType;
import com.bank.app.payload.request.TransactionRequest;
import com.bank.app.payload.response.MessageResponse;
import com.bank.app.repository.AccountRepository;
import com.bank.app.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    TransactionRepository transactionRepository;

    @Autowired
    AccountRepository accountRepository;

    /**
     * Performs a funds transfer between two accounts.
     * Allowed Roles: CUSTOMER (if owner of source account), STAFF
     *
     * @param request details including source/destination accounts and amount
     * @return MessageResponse indicating success with transaction reference
     */
    @PostMapping("/transfer")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('STAFF')")
    @Transactional
    public ResponseEntity<?> performTransfer(@Valid @RequestBody TransactionRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Account sourceAccount = accountRepository.findByAccountNumber(request.getSourceAccountNumber()).orElse(null);
        Account destAccount = accountRepository.findByAccountNumber(request.getDestinationAccountNumber()).orElse(null);

        if (sourceAccount == null || destAccount == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid account details."));
        }

        boolean isStaff = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_STAFF"));
        if (!isStaff && !sourceAccount.getUser().getUsername().equals(userDetails.getUsername())) {
             return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized to transfer from this account."));
        }

        if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Insufficient funds."));
        }

        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
        destAccount.setBalance(destAccount.getBalance().add(request.getAmount()));

        accountRepository.save(sourceAccount);
        accountRepository.save(destAccount);

        Transaction transaction = Transaction.builder()
                .referenceNumber(UUID.randomUUID().toString())
                .sourceAccount(sourceAccount)
                .destinationAccount(destAccount)
                .amount(request.getAmount())
                .transactionType(TransactionType.TRANSFER)
                .status(TransactionStatus.COMPLETED)
                .timestamp(LocalDateTime.now())
                .description(request.getDescription())
                .build();

        transactionRepository.save(transaction);

        return ResponseEntity.ok(new MessageResponse("Transfer completed successfully. Ref: " + transaction.getReferenceNumber()));
    }

    /**
     * Retrieves the transaction history for a specific account.
     * Allowed Roles: CUSTOMER (if owner), STAFF
     *
     * @param accountNumber the account number to get history for
     * @return List of Transaction entities
     */
    @GetMapping("/history/{accountNumber}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('STAFF')")
    public ResponseEntity<?> getTransactionHistory(@PathVariable String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber).orElse(null);
        if (account == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Account not found."));
        }

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isStaff = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_STAFF"));
        
        if (!isStaff && !account.getUser().getUsername().equals(userDetails.getUsername())) {
             return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized."));
        }

        List<Transaction> transactions = transactionRepository.findByAccountNumber(accountNumber);
        return ResponseEntity.ok(transactions);
    }
}

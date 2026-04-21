package com.bank.app.controller;

import com.bank.app.entity.Account;
import com.bank.app.entity.AccountType;
import com.bank.app.entity.User;
import com.bank.app.payload.request.AccountRequest;
import com.bank.app.payload.response.MessageResponse;
import com.bank.app.repository.AccountRepository;
import com.bank.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    UserRepository userRepository;

    /**
     * Endpoint to create a new banking account for a user.
     * Allowed Roles: CUSTOMER, STAFF
     * 
     * @param accountRequest contains initial balance and account type
     * @return MessageResponse indicating success with account number
     */
    @PostMapping("/create")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('STAFF')")
    public ResponseEntity<?> createAccount(@Valid @RequestBody AccountRequest accountRequest) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        AccountType type;
        try {
            type = AccountType.valueOf(accountRequest.getAccountType().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid account type."));
        }

        String accountNumber = generateAccountNumber();
        
        Account account = Account.builder()
                .accountNumber(accountNumber)
                .user(user)
                .accountType(type)
                .balance(BigDecimal.valueOf(accountRequest.getInitialBalance()))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        accountRepository.save(account);

        return ResponseEntity.ok(new MessageResponse("Account created successfully. Account Number: " + accountNumber));
    }

    /**
     * Endpoint for users to retrieve a list of all their accounts.
     * Allowed Roles: CUSTOMER
     * 
     * @return List of Account objects belonging to the current authenticated user
     */
    @GetMapping("/my-accounts")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<Account>> getMyAccounts() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        List<Account> accounts = accountRepository.findByUserId(user.getId());
        return ResponseEntity.ok(accounts);
    }
    
    /**
     * Endpoint to retrieve details of a specific account using the account number.
     * Allowed Roles: CUSTOMER (if it's their own account), STAFF (can view any account)
     * 
     * @param accountNumber path parameter for the specific account
     * @return Account details or error response if not found/unauthorized
     */
    @GetMapping("/{accountNumber}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('STAFF')")
    public ResponseEntity<?> getAccountDetails(@PathVariable String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber).orElse(null);
        if (account == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Account not found."));
        }
        
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isStaff = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_STAFF"));
        if (!isStaff && !account.getUser().getUsername().equals(userDetails.getUsername())) {
             return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized to view this account."));
        }
        
        return ResponseEntity.ok(account);
    }

    private String generateAccountNumber() {
        return String.format("%010d", Math.abs(UUID.randomUUID().getMostSignificantBits() % 10000000000L));
    }
}

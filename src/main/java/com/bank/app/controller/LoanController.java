package com.bank.app.controller;

import com.bank.app.entity.Loan;
import com.bank.app.entity.LoanStatus;
import com.bank.app.entity.User;
import com.bank.app.payload.request.LoanRequest;
import com.bank.app.payload.response.MessageResponse;
import com.bank.app.repository.LoanRepository;
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

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/loans")
public class LoanController {

    @Autowired
    LoanRepository loanRepository;

    @Autowired
    UserRepository userRepository;

    /**
     * Applies for a new loan.
     * Allowed Roles: CUSTOMER
     *
     * @param request details including loan amount and term months
     * @return MessageResponse indicating successful application
     */
    @PostMapping("/apply")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> applyForLoan(@Valid @RequestBody LoanRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        Loan loan = Loan.builder()
                .user(user)
                .amount(request.getAmount())
                .termMonths(request.getTermMonths())
                .interestRate(new BigDecimal("5.5")) // Static rate
                .status(LoanStatus.PENDING)
                .appliedAt(LocalDateTime.now())
                .build();

        loanRepository.save(loan);

        return ResponseEntity.ok(new MessageResponse("Loan application submitted successfully."));
    }

    /**
     * Retrieves all loans for the currently authenticated user.
     * Allowed Roles: CUSTOMER
     *
     * @return List of user's Loan entities
     */
    @GetMapping("/my-loans")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<Loan>> getMyLoans() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        return ResponseEntity.ok(loanRepository.findByUserId(user.getId()));
    }

    /**
     * Retrieves all loans in the system.
     * Allowed Roles: LOAN_OFFICER, ADMIN
     *
     * @return List of all Loan entities
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('LOAN_OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<List<Loan>> getAllLoans() {
        return ResponseEntity.ok(loanRepository.findAll());
    }

    /**
     * Processes a loan application by updating its status.
     * Allowed Roles: LOAN_OFFICER
     *
     * @param loanId the ID of the loan to process
     * @param status the new status (e.g., APPROVED, REJECTED)
     * @param remarks optional remarks from the officer
     * @return MessageResponse indicating success or error
     */
    @PutMapping("/{loanId}/process")
    @PreAuthorize("hasRole('LOAN_OFFICER')")
    public ResponseEntity<?> processLoan(@PathVariable Long loanId, @RequestParam String status, @RequestParam(required = false) String remarks) {
        Loan loan = loanRepository.findById(loanId).orElse(null);
        if (loan == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Loan not found."));
        }

        try {
            LoanStatus loanStatus = LoanStatus.valueOf(status.toUpperCase());
            loan.setStatus(loanStatus);
            loan.setProcessedAt(LocalDateTime.now());
            loan.setOfficerRemarks(remarks);
            loanRepository.save(loan);
            return ResponseEntity.ok(new MessageResponse("Loan status updated to " + loanStatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid loan status."));
        }
    }
}

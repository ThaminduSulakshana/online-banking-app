package com.bank.app.repository;

import com.bank.app.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUserId(Long userId);
    List<Loan> findByStatus(com.bank.app.entity.LoanStatus status);
}

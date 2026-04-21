package com.bank.app.repository;

import com.bank.app.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    @Query("SELECT t FROM Transaction t WHERE t.sourceAccount.accountNumber = :accountNumber OR t.destinationAccount.accountNumber = :accountNumber ORDER BY t.timestamp DESC")
    List<Transaction> findByAccountNumber(@Param("accountNumber") String accountNumber);
}

package com.bank.app.repository;

import com.bank.app.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByAccount_UserId(Long userId);
}

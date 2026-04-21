package com.bank.app.repository;

import com.bank.app.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByCustomerId(Long customerId);
    List<SupportTicket> findByAssignedOfficerId(Long officerId);
    List<SupportTicket> findByStatus(com.bank.app.entity.TicketStatus status);
}

package com.bank.app.controller;

import com.bank.app.entity.SupportTicket;
import com.bank.app.entity.TicketStatus;
import com.bank.app.entity.User;
import com.bank.app.payload.request.TicketRequest;
import com.bank.app.payload.response.MessageResponse;
import com.bank.app.repository.SupportTicketRepository;
import com.bank.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/support")
public class SupportController {

    @Autowired
    SupportTicketRepository ticketRepository;

    @Autowired
    UserRepository userRepository;

    /**
     * Creates a new support ticket.
     * Allowed Roles: CUSTOMER
     *
     * @param request details including subject and description
     * @return MessageResponse indicating success
     */
    @PostMapping("/create")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createTicket(@Valid @RequestBody TicketRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        SupportTicket ticket = SupportTicket.builder()
                .subject(request.getSubject())
                .description(request.getDescription())
                .customer(user)
                .status(TicketStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build();

        ticketRepository.save(ticket);
        return ResponseEntity.ok(new MessageResponse("Support ticket created successfully."));
    }

    /**
     * Retrieves all support tickets created by the authenticated user.
     * Allowed Roles: CUSTOMER
     *
     * @return List of user's SupportTicket entities
     */
    @GetMapping("/my-tickets")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<SupportTicket>> getMyTickets() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        return ResponseEntity.ok(ticketRepository.findByCustomerId(user.getId()));
    }

    /**
     * Retrieves all support tickets.
     * Allowed Roles: SUPPORT_OFFICER, ADMIN
     *
     * @return List of all SupportTicket entities
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('SUPPORT_OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<List<SupportTicket>> getAllTickets() {
        return ResponseEntity.ok(ticketRepository.findAll());
    }

    /**
     * Assigns a support ticket to the currently authenticated support officer.
     * Allowed Roles: SUPPORT_OFFICER
     *
     * @param ticketId the ID of the ticket to assign
     * @return MessageResponse indicating success or error
     */
    @PutMapping("/{ticketId}/assign")
    @PreAuthorize("hasRole('SUPPORT_OFFICER')")
    public ResponseEntity<?> assignTicket(@PathVariable Long ticketId) {
        SupportTicket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Ticket not found."));
        }

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User officer = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        ticket.setAssignedOfficer(officer);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        ticketRepository.save(ticket);

        return ResponseEntity.ok(new MessageResponse("Ticket assigned successfully."));
    }

    /**
     * Resolves a support ticket. Only the assigned officer can resolve it.
     * Allowed Roles: SUPPORT_OFFICER
     *
     * @param ticketId the ID of the ticket to resolve
     * @param remarks optional resolution remarks
     * @return MessageResponse indicating success or error
     */
    @PutMapping("/{ticketId}/resolve")
    @PreAuthorize("hasRole('SUPPORT_OFFICER')")
    public ResponseEntity<?> resolveTicket(@PathVariable Long ticketId, @RequestParam String remarks) {
        SupportTicket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Ticket not found."));
        }

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        if (ticket.getAssignedOfficer() == null || !ticket.getAssignedOfficer().getUsername().equals(userDetails.getUsername())) {
             return ResponseEntity.status(403).body(new MessageResponse("Error: You are not assigned to this ticket."));
        }

        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setResolvedAt(LocalDateTime.now());
        ticket.setResolutionRemarks(remarks);
        ticketRepository.save(ticket);

        return ResponseEntity.ok(new MessageResponse("Ticket resolved successfully."));
    }
}

package com.bank.app.controller;

import com.bank.app.entity.Account;
import com.bank.app.entity.Card;
import com.bank.app.entity.CardStatus;
import com.bank.app.entity.CardType;
import com.bank.app.payload.request.CardRequest;
import com.bank.app.payload.response.MessageResponse;
import com.bank.app.repository.AccountRepository;
import com.bank.app.repository.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cards")
public class CardController {

    @Autowired
    CardRepository cardRepository;

    @Autowired
    AccountRepository accountRepository;

    /**
     * Issues a new card for a specific account.
     * Allowed Roles: CARD_OFFICER, ADMIN
     *
     * @param request details including account number and card type
     * @return MessageResponse indicating success with the new card number
     */
    @PostMapping("/issue")
    @PreAuthorize("hasRole('CARD_OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> issueCard(@Valid @RequestBody CardRequest request) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber()).orElse(null);
        if (account == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Account not found."));
        }

        CardType type;
        try {
            type = CardType.valueOf(request.getCardType().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid card type."));
        }

        String cardNumber = generateCardNumber();
        String cvv = String.format("%03d", new Random().nextInt(1000));

        Card card = Card.builder()
                .cardNumber(cardNumber)
                .account(account)
                .cardType(type)
                .status(CardStatus.ACTIVE)
                .issueDate(LocalDate.now())
                .expiryDate(LocalDate.now().plusYears(4))
                .cvv(cvv)
                .build();

        cardRepository.save(card);
        return ResponseEntity.ok(new MessageResponse("Card issued successfully. Card Number: " + cardNumber));
    }

    /**
     * Blocks an existing card. Can be done by the card owner or a card officer.
     * Allowed Roles: CARD_OFFICER, CUSTOMER (if owner)
     *
     * @param cardId the ID of the card to block
     * @return MessageResponse indicating success or error
     */
    @PutMapping("/{cardId}/block")
    @PreAuthorize("hasRole('CARD_OFFICER') or hasRole('CUSTOMER')")
    public ResponseEntity<?> blockCard(@PathVariable Long cardId) {
        Card card = cardRepository.findById(cardId).orElse(null);
        if (card == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Card not found."));
        }

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isOfficer = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CARD_OFFICER"));

        if (!isOfficer && !card.getAccount().getUser().getUsername().equals(userDetails.getUsername())) {
             return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized."));
        }

        card.setStatus(CardStatus.BLOCKED);
        cardRepository.save(card);

        return ResponseEntity.ok(new MessageResponse("Card blocked successfully."));
    }

    private String generateCardNumber() {
        return "4" + String.format("%015d", Math.abs(new Random().nextLong() % 1000000000000000L));
    }
}

package com.bank.app.controller;

import com.bank.app.entity.Advertisement;
import com.bank.app.payload.request.AdvertisementRequest;
import com.bank.app.payload.response.MessageResponse;
import com.bank.app.repository.AdvertisementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/advertisements")
public class AdvertisementController {

    @Autowired
    AdvertisementRepository advertisementRepository;

    /**
     * Creates a new advertisement.
     * Allowed Roles: ADVERTISEMENT_ADMIN, ADMIN
     *
     * @param request advertisement details (title, content, imageUrl, isActive)
     * @return MessageResponse indicating success
     */
    @PostMapping("/create")
    @PreAuthorize("hasRole('ADVERTISEMENT_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> createAd(@Valid @RequestBody AdvertisementRequest request) {
        Advertisement ad = Advertisement.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .isActive(request.isActive())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        advertisementRepository.save(ad);
        return ResponseEntity.ok(new MessageResponse("Advertisement created successfully."));
    }

    /**
     * Updates an existing advertisement by its ID.
     * Allowed Roles: ADVERTISEMENT_ADMIN, ADMIN
     *
     * @param id the ID of the advertisement to update
     * @param request updated advertisement details
     * @return MessageResponse indicating success or error
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADVERTISEMENT_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> updateAd(@PathVariable Long id, @Valid @RequestBody AdvertisementRequest request) {
        Advertisement ad = advertisementRepository.findById(id).orElse(null);
        if (ad == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Advertisement not found."));
        }

        ad.setTitle(request.getTitle());
        ad.setContent(request.getContent());
        ad.setImageUrl(request.getImageUrl());
        ad.setActive(request.isActive());
        ad.setUpdatedAt(LocalDateTime.now());

        advertisementRepository.save(ad);
        return ResponseEntity.ok(new MessageResponse("Advertisement updated successfully."));
    }

    /**
     * Deletes an existing advertisement by its ID.
     * Allowed Roles: ADVERTISEMENT_ADMIN, ADMIN
     *
     * @param id the ID of the advertisement to delete
     * @return MessageResponse indicating success or error
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADVERTISEMENT_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteAd(@PathVariable Long id) {
        if (!advertisementRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Advertisement not found."));
        }
        advertisementRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Advertisement deleted successfully."));
    }

    /**
     * Retrieves all currently active advertisements.
     * Allowed Roles: Public (or Customer based on security config)
     *
     * @return List of active Advertisement entities
     */
    @GetMapping("/active")
    public ResponseEntity<List<Advertisement>> getActiveAds() {
        return ResponseEntity.ok(advertisementRepository.findByIsActiveTrue());
    }

    /**
     * Retrieves all advertisements (active and inactive).
     * Allowed Roles: ADVERTISEMENT_ADMIN, ADMIN
     *
     * @return List of all Advertisement entities
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADVERTISEMENT_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<List<Advertisement>> getAllAds() {
        return ResponseEntity.ok(advertisementRepository.findAll());
    }
}

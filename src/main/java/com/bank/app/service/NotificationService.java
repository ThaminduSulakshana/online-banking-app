package com.bank.app.service;

import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class NotificationService {
    
    public void sendEmailNotifcation(String email, String subject, String message) {
        log.info("Sending Email to {}: Subject: {} | Message: {}", email, subject, message);
    }
    
    public void sendSmsNotification(String phoneNumber, String message) {
        log.info("Sending SMS to {}: Message: {}", phoneNumber, message);
    }
}

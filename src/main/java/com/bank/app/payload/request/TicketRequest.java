package com.bank.app.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketRequest {

    @NotBlank
    private String subject;

    @NotBlank
    private String description;
}

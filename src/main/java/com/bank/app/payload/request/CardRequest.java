package com.bank.app.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CardRequest {

    @NotBlank
    private String accountNumber;

    @NotBlank
    private String cardType;
}

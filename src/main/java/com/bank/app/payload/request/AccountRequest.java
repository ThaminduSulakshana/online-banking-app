package com.bank.app.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountRequest {
    @NotBlank
    private String accountType;
    
    private Double initialBalance = 0.0;
}

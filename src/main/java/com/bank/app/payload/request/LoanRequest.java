package com.bank.app.payload.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class LoanRequest {

    @NotNull
    @DecimalMin(value = "100.00", message = "Minimum loan amount is 100")
    private BigDecimal amount;

    @NotNull
    @Min(value = 1, message = "Term must be at least 1 month")
    private Integer termMonths;
}

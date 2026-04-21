package com.bank.app.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdvertisementRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private String imageUrl;

    private boolean isActive;
}

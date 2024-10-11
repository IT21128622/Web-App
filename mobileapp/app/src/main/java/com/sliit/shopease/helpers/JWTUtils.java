package com.sliit.shopease.helpers;

import android.util.Base64;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

public class JWTUtils {
  // Method to decode JWT and check expiration
  public static boolean isTokenExpired(String JWTEncoded) {
    try {
      // Split JWT into parts
      String[] split = JWTEncoded.split("\\.");
      String payload = getDecodedPart(split[1]);

      // Convert the payload to a JSON object
      JSONObject jsonPayload = new JSONObject(payload);

      // Extract the 'exp' field (expiration time)
      if (jsonPayload.has("exp")) {
        long exp = jsonPayload.getLong("exp");

        // Get the current time in seconds
        long currentTime = System.currentTimeMillis() / 1000;

        // Check if the token has expired
        return exp < currentTime;
      } else {
        // If there's no 'exp' claim, treat the token as not expired
        return false;
      }
    } catch (JSONException e) {
      e.printStackTrace();
      return true;  // Assume expired on error
    }
  }

  // Base64 decoder method for JWT parts
  private static String getDecodedPart(String encodedPart) {
    byte[] decodedBytes = Base64.decode(encodedPart, Base64.URL_SAFE);
    return new String(decodedBytes, StandardCharsets.UTF_8);
  }
}

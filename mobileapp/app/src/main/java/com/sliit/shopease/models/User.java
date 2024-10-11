package com.sliit.shopease.models;

import com.google.gson.Gson;
import com.sliit.shopease.helpers.JWTUtils;

public class User {
  private final String id;
  private final String username;
  private final String email;
  private final String token;
  private final boolean isActive;

  public User(String id, String username, String email, String token, boolean isActive) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.token = token;
    this.isActive = isActive;
  }

  // fromJson method
  public static User fromJson(String jsonString) {
    Gson gson = new Gson();
    return gson.fromJson(jsonString, User.class);
  }

  public String getId() {
    return id;
  }

  public String getUsername() {
    return username;
  }

  public String getEmail() {
    return email;
  }

  public String getToken() {
    return token;
  }

  public boolean getIsActive() {
    return this.isActive;
  }

  public boolean isTokenInvalid() {
    //decode jwt token
    return JWTUtils.isTokenExpired(token);
  }

  // toJson method
  public String toJson() {
    Gson gson = new Gson();
    return gson.toJson(this);
  }

  /**
   * Pass null when change not needed to variable
   * @param id
   * @param username
   * @param email
   * @param token
   * @param isActive
   * @return new User object with updated values
   */
  public User copyWith(
      String id,
      String username,
      String email,
      String token,
      Boolean isActive
  ) {
    return new User(
        id != null ? id : this.id,
        username != null ? username : this.username,
        email != null ? email : this.email,
        token != null ? token : this.token,
        isActive != null ? isActive : this.isActive
    );
  }
}

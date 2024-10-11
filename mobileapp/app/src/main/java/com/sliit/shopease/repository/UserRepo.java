package com.sliit.shopease.repository;

import android.content.Context;

import com.sliit.shopease.constants.ApiEndPoints;
import com.sliit.shopease.constants.PrefKeys;
import com.sliit.shopease.helpers.NetworkHelper;
import com.sliit.shopease.helpers.SharedPreferencesHelper;
import com.sliit.shopease.interfaces.NetworkCallback;
import com.sliit.shopease.models.ShopEaseError;
import com.sliit.shopease.models.User;

import java.util.HashMap;
import java.util.Map;

public class UserRepo {
  private final NetworkHelper networkHelper = NetworkHelper.getInstance();
  private final SharedPreferencesHelper sharedPreferencesHelper;

  public UserRepo(Context context) {
    sharedPreferencesHelper = new SharedPreferencesHelper(context);
  }

  public void sendOtp(Context context, String email, NetworkCallback<String> callback) {
    networkHelper.post(context, ApiEndPoints.SEND_OTP + email + "/customer", null, new NetworkCallback<String>() {
      @Override
      public void onSuccess(String response) {
        callback.onSuccess("success");
      }

      @Override
      public void onFailure(ShopEaseError error) {
        callback.onFailure(error);
      }
    });
  }

  public void updateUser(Context context, String email, String username, NetworkCallback<String> callback) {
    SharedPreferencesHelper sharedPreferencesHelper = new SharedPreferencesHelper(context);
    User user = User.fromJson(sharedPreferencesHelper.getString(PrefKeys.USER, ""));


    networkHelper.put(context, ApiEndPoints.UPDATE_USER + user.getId(), true, null, new NetworkCallback<String>() {
      @Override
      public void onSuccess(String response) {
        callback.onSuccess("success");
      }

      @Override
      public void onFailure(ShopEaseError error) {
        callback.onFailure(error);
      }
    });
  }

  public void validateOtp(Context context, String email, String otp, NetworkCallback<String> callback) {
    final Map<String, String> jsonBody = new HashMap<>();
    jsonBody.put("Code", otp);

    networkHelper.post(context, ApiEndPoints.VALIDATE_OTP + email + "/customer", jsonBody, new NetworkCallback<String>() {
      @Override
      public void onSuccess(String response) {
        System.out.println(response);
        callback.onSuccess("success");
      }

      @Override
      public void onFailure(ShopEaseError error) {
        System.out.println(error);
        callback.onFailure(error);
      }
    });
  }

  public void updatePassword(Context context, String email, String password, String otp, NetworkCallback<Boolean> callback) {
    final Map<String, String> jsonBody = new HashMap<>();
    jsonBody.put("Password", password);
    jsonBody.put("Code", otp);

    networkHelper.put(context, String.format(ApiEndPoints.UPDATE_PASSWORD, email), false, jsonBody, new NetworkCallback<String>() {
      @Override
      public void onSuccess(String response) {
        System.out.println("Password Reset Successful");
        callback.onSuccess(true);
      }

      @Override
      public void onFailure(ShopEaseError error) {
        callback.onFailure(error);
      }
    });
  }

  public void disable(Context context, NetworkCallback<Boolean> callback) {
    User user = User.fromJson(sharedPreferencesHelper.getString(PrefKeys.USER, ""));

    final String api = String.format(ApiEndPoints.DISABLE_USER, user.getId(), user.getEmail());
    networkHelper.put(context, api, true, null, new NetworkCallback<String>() {
      @Override
      public void onSuccess(String response) {
        callback.onSuccess(true);
      }

      @Override
      public void onFailure(ShopEaseError error) {
        callback.onFailure(error);
      }
    });
  }
}

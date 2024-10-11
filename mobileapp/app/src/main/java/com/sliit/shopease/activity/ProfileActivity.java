package com.sliit.shopease.activity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.sliit.shopease.R;
import com.sliit.shopease.constants.PrefKeys;
import com.sliit.shopease.helpers.DialogHelper;
import com.sliit.shopease.helpers.SharedPreferencesHelper;
import com.sliit.shopease.interfaces.NetworkCallback;
import com.sliit.shopease.models.ShopEaseError;
import com.sliit.shopease.models.User;
import com.sliit.shopease.repository.UserRepo;

public class ProfileActivity extends AppCompatActivity {
  SharedPreferencesHelper sharedPreferencesHelper;
  UserRepo userRepo;
  private EditText prof_edt_name;
  private EditText prof_edt_email;
  private TextView prof_txt_status;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    EdgeToEdge.enable(this);
    setContentView(R.layout.activity_profile);
    ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
      Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
      v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
      return insets;
    });

    userRepo = new UserRepo(this);

    Button prof_btn_logout = findViewById(R.id.prof_btn_logout);
    Button prof_btn_update = findViewById(R.id.prof_btn_update);
    Button prof_btn_disable = findViewById(R.id.prof_btn_disable);

    prof_edt_email = findViewById(R.id.prof_edt_email);
    prof_edt_name = findViewById(R.id.prof_edt_name);
    prof_txt_status = findViewById(R.id.prof_txt_status);

    prof_btn_logout.setOnClickListener(v -> logout());
    prof_btn_update.setOnClickListener(this::update);
    prof_btn_disable.setOnClickListener(this::disable);

    sharedPreferencesHelper = new SharedPreferencesHelper(this);

    setValues();
  }

  private void disable(View view) {
    DialogHelper.showAlertWithCallback(ProfileActivity.this, "Alert!!!", "Are you sure you want to disable your account? Account can only be reactivated via a Admin or CSR!", new DialogHelper.DialogCallback() {
      @Override
      public void onOk(String inputText) {
        DialogHelper.showLoading(ProfileActivity.this, "Disabling...");
        userRepo.disable(ProfileActivity.this, new NetworkCallback<Boolean>() {
          @Override
          public void onSuccess(Boolean response) {
            User user = User.fromJson(sharedPreferencesHelper.getString(PrefKeys.USER, ""));
            user = user.copyWith(null, null, null, null, false);
            sharedPreferencesHelper.saveString(PrefKeys.USER, user.toJson());

            setValues();
            DialogHelper.hideLoading();
          }

          @Override
          public void onFailure(ShopEaseError error) {
            DialogHelper.hideLoading();
            runOnUiThread(()-> {
              DialogHelper.showAlert(ProfileActivity.this, "Error", error.getMessage());
            });
          }
        });
      }

      @Override
      public void onCancel() {
      }
    });
  }

  private void setValues() {
    final String userJson = sharedPreferencesHelper.getString(PrefKeys.USER, "");
    User user = User.fromJson(userJson);
    final boolean isActive = user.getIsActive();

    prof_txt_status.setText(isActive ? "Active" : "Deactivated");
    prof_txt_status.setBackgroundResource(isActive ? R.color.green : R.color.red);

    prof_txt_status.setTextColor(isActive
        ? getResources().getColor(R.color.black, null)
        : getResources().getColor(R.color.white, null)
    );
  }

  void logout() {
    sharedPreferencesHelper.remove(PrefKeys.USER);

    //go to login page
    startActivity(new Intent(this, SignInActivity.class));
    finish();
  }

  void update(View v) {
    prof_edt_name.clearFocus();
    prof_edt_email.clearFocus();

    InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
    if (imm != null) {
      imm.hideSoftInputFromWindow(v.getWindowToken(), 0);
    }

    String name = prof_edt_name.getText().toString().trim();
    String email = prof_edt_email.getText().toString().trim();

    if (name.isEmpty() || email.isEmpty()) {
      DialogHelper.showAlert(this, "Error", "Please enter both name and email");
      return;
    }

    DialogHelper.showLoading(this, "Updating...");
  }
}
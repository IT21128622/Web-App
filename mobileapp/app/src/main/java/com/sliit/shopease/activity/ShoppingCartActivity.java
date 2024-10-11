package com.sliit.shopease.activity;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.sliit.shopease.R;
import com.sliit.shopease.models.Cart;
import com.sliit.shopease.models.Product;

public class ShoppingCartActivity extends AppCompatActivity {
  private Cart cart;
  private Button cart_btn_pay;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    EdgeToEdge.enable(this);
    setContentView(R.layout.activity_shopping_cart);
    ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
      Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
      v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
      return insets;
    });

    cart = new Cart(this);

    RecyclerView rv_cart = findViewById(R.id.cart_rv_items);
    cart_btn_pay = findViewById(R.id.cart_btn_pay);

    cart_btn_pay.setOnClickListener(v -> pay());

    LinearLayoutManager linearLayoutManager = new LinearLayoutManager(ShoppingCartActivity.this, LinearLayoutManager.VERTICAL, false);
    RvAdapter rvAdapter = new RvAdapter(cart);
    rv_cart.setLayoutManager(linearLayoutManager);
    rv_cart.setAdapter(rvAdapter);

    cart_btn_pay.setText(getString(R.string.pay_now, cart.getTotalPrice()));
  }

  private void pay(){

  }

  public class RvAdapter extends RecyclerView.Adapter<RvAdapter.RvHolder> {
    private final Cart cart;

    public RvAdapter(Cart cart) {
      this.cart = cart;
    }

    @NonNull
    @Override
    public RvHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
      View view = LayoutInflater.from(ShoppingCartActivity.this).inflate(R.layout.layout_cart_item, parent, false);
      return new RvHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RvHolder holder, int position) {
      final String productJson = cart.getItems().keySet().toArray()[position].toString();
      final Product product = Product.fromJson(productJson);

      holder.cartItem_txt_name.setText(product.getProductName());
      holder.cardItem_txt_price.setText(product.getPriceString());
      holder.cardItem_txt_count.setText(String.valueOf(cart.getProductCount(product)));
      holder.cardItem_txt_stock.setText(getString(R.string.slash_val, product.getStockLevel()));

      holder.cardItem_btn_add.setOnClickListener(v -> {
        cart.addItem(product);
        holder.cardItem_txt_count.setText(String.valueOf(cart.getProductCount(product)));
        cart_btn_pay.setText(getString(R.string.pay_now, cart.getTotalPrice()));
      });

      holder.cardItem_btn_subtract.setOnClickListener(v -> {
        cart.reduceItem(product);
        holder.cardItem_txt_count.setText(String.valueOf(cart.getProductCount(product)));
        cart_btn_pay.setText(getString(R.string.pay_now, cart.getTotalPrice()));
        notifyDataSetChanged();
      });
    }

    @Override
    public int getItemCount() {
      return cart.getItems().size();
    }


    private class RvHolder extends RecyclerView.ViewHolder {
      private final TextView cartItem_txt_name;
      private final TextView cardItem_txt_price;
      private final TextView cardItem_txt_count;
      private final TextView cardItem_txt_stock;
      private final ImageButton cardItem_btn_add;
      private final ImageButton cardItem_btn_subtract;

      public RvHolder(@NonNull View itemView) {
        super(itemView);

        cartItem_txt_name = itemView.findViewById(R.id.cartItem_txt_name);
        cardItem_txt_price = itemView.findViewById(R.id.cardItem_txt_price);
        cardItem_txt_count = itemView.findViewById(R.id.cardItem_txt_count);
        cardItem_btn_add = itemView.findViewById(R.id.cardItem_btn_add);
        cardItem_btn_subtract = itemView.findViewById(R.id.cardItem_btn_subtract);
        cardItem_txt_stock = itemView.findViewById(R.id.cardItem_txt_stock);
      }
    }
  }
}
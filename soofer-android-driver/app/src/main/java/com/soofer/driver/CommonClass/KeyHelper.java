package com.soofer.driver.CommonClass;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.util.Log;

import com.soofer.driver.BuildConfig;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class KeyHelper {

    /**
     * @param key string like: SHA1, SHA256, MD5.
     */
    @SuppressLint("PackageManagerGetSignatures") // test purpose
    public void get(Context context, String key) {
        try {
            final PackageInfo info = context.getPackageManager()
                    .getPackageInfo(BuildConfig.APPLICATION_ID, PackageManager.GET_SIGNATURES);

            for (Signature signature : info.signatures) {
                final MessageDigest md = MessageDigest.getInstance(key);
                md.update(signature.toByteArray());

                final byte[] digest = md.digest();
                final StringBuilder toRet = new StringBuilder();
                for (int i = 0; i < digest.length; i++) {
                    if (i != 0) toRet.append(":");
                    int b = digest[i] & 0xff;
                    String hex = Integer.toHexString(b);
                    if (hex.length() == 1) toRet.append("0");
                    toRet.append(hex);
                }

                Log.e("getSha1"+KeyHelper.class.getSimpleName(), key + " " + toRet.toString());
                SharedHelper.putKey(context,"SHA1Key", toRet.toString());
                System.out.println("Sha1111:" + SharedHelper.getKey(context,"SHA1Key"));
            }
        } catch (PackageManager.NameNotFoundException e1) {
            Log.e("name not found", e1.toString());
        } catch (NoSuchAlgorithmException e) {
            Log.e("no such an algorithm", e.toString());
        } catch (Exception e) {
            Log.e("exception", e.toString());
        }
    }
}
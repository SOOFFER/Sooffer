# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile
-keep class com.soofer.app.Appcontroller.Appcontroller { *; }
-keep class androidx.fragment.app.** { *; }
-keepclassmembers class androidx.fragment.app.** { *; }

-keep class com.soofer.app.** extends androidx.fragment.app.Fragment { *; }
-keepclassmembers class * extends androidx.fragment.app.Fragment {
    public <init>(...);
}

-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

-keep class androidx.fragment.app.FragmentManagerState { *; }
-keep class androidx.fragment.app.FragmentState { *; }
-keep class androidx.fragment.app.BackStackState { *; }
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep class androidx.startup.** { *; }
-keep class * implements androidx.startup.Initializer { *; }
-keepnames class * implements androidx.startup.Initializer
-keepclassmembers class * {
    android.os.Bundle metaData;
}
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}

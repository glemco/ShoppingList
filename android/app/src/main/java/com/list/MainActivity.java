package com.list;

import com.facebook.react.ReactActivity;
import com.jblack.keyboardaware.views.scrollview.AndroidKeyboardAwareScrollViewPackage;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "list";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
      mReactInstanceManager = ReactInstanceManager.builder()
        .addPackage(new AndroidKeyboardAwareScrollViewPackage())
        .build();
    }
}

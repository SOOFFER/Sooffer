package com.soofer.app.CommonClass;

import android.os.Bundle;
import androidx.annotation.CallSuper;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.View;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;

import java.util.Objects;

public abstract class BaseFragment extends Fragment {

    private boolean mIsInjected = false;

    protected BottomSheetDialogFragment dialogFragment;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRetainInstance(true);

        try {
            mIsInjected = onInjectView();
        } catch (IllegalStateException e) {
            Log.e(e.getClass().getSimpleName(), Objects.requireNonNull(e.getMessage()));
            mIsInjected = false;
        }
    }

    @Override
    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        if (mIsInjected) onViewInjected(savedInstanceState);
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        if (!mIsInjected) {
            mIsInjected = onInjectView();
            if (mIsInjected) onViewInjected(savedInstanceState);
        }
    }

   /* *//**
     * Gets a component for dependency injection by its type.
     *
     * @throws IllegalStateException if component has not been initialized yet.
     *//*
    @SuppressWarnings("unchecked")
    protected <C> C getComponent(Class<C> componentType) throws IllegalStateException {
        C component = componentType.cast(((HasComponent<C>) getActivity()).getComponent());
        if (component == null) {
            throw new IllegalStateException(componentType.getSimpleName() + " has not been initialized yet.");
        }
        return component;
    }*/

    /**
     * Called to do an optional injection. This will be called on {@link #onCreate(Bundle)} and if
     * an exception is thrown or false returned, on {@link #onActivityCreated(Bundle)} again.
     * Within this method get the injection component and inject the view. Based on returned value
     * {@link #onViewInjected(Bundle)} will be called. Check {@link #onViewInjected(Bundle)}
     * documentation for more info.
     *
     * @return True, if injection was successful, false otherwise. Returns false by default.
     * @throws IllegalStateException If there is a failure in getting injection component or
     *                               injection process itself. This can occur if activity holding
     *                               component instance has been killed by the system and has not
     *                               been initialized yet.
     */
    protected boolean onInjectView() throws IllegalStateException {
        // Return false by default.
        return false;
    }


    @CallSuper
    protected void onViewInjected(Bundle savedInstanceState) {
        // Intentionally left empty.
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            if(dialogFragment!=null && dialogFragment.isAdded()){
                dialogFragment.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}


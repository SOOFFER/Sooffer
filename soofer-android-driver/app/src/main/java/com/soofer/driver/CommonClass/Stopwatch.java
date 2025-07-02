package com.soofer.driver.CommonClass;

import android.os.Handler;

import static com.soofer.driver.CommonClass.CommonData.LastPastTime;
import static com.soofer.driver.CommonClass.CommonData.currentTime;
import static com.soofer.driver.CommonClass.CommonData.startTime;


public class Stopwatch {
    public interface StopWatchListener {
        public void onTick(String time);
    }


    private boolean running = false;


    public Stopwatch() {

    }

    public Stopwatch(StopWatchListener listener) {
        this.listener = listener;
    }

    public void start() {
        startTime = System.currentTimeMillis();
        this.running = true;
        final Handler handler = new Handler();
        handler.post(new Runnable() {
            @Override
            public void run() {
                //lock to access running
                synchronized (Stopwatch.this) {
                    if (running) {
                        if (listener != null)
                            listener.onTick(Stopwatch.this.toString());
                        handler.postDelayed(this, 1000);
                    }
                }
            }
        });

    }

    /**
     * Overload
     * <p/>
     * Starts the stopwatch from an offset
     *
     * @param offset The offset in milli seconds
     */
    public void start(long offset) {
        stop();
        startTime = System.currentTimeMillis() - offset;
        this.running = true;
        final Handler handler = new Handler();
        handler.post(new Runnable() {
            @Override
            public void run() {
                //lock to access running
                synchronized (Stopwatch.this) {
                    if (running) {
                        if (listener != null)
                            listener.onTick(Stopwatch.this.toString());
                        handler.postDelayed(this, 1000);
                    }
                }
            }
        });
    }

    public synchronized void stop() {
        this.running = false;
    }

    public void restart() {
        this.stop();
        this.start();
    }

    public synchronized void pause() {
        if (!isRunning()) return;
        this.running = false;
        currentTime = System.currentTimeMillis() - startTime;
        LastPastTime = System.currentTimeMillis();
    }

    public void resume() {
        if (running) return;
        synchronized (Stopwatch.this) {
            this.running = true;
            startTime = System.currentTimeMillis() - currentTime;
        }
        final Handler handler = new Handler();
        handler.post(new Runnable() {
            @Override
            public void run() {
                if (running) {
                    if (listener != null)
                        listener.onTick(Stopwatch.this.toString());
                    handler.postDelayed(this, 1000);
                }
            }
        });
    }

    //elaspsed time in milliseconds
    public long getElapsedTimeMili() {
        long elapsed = 0;
        if (running) {
            elapsed = ((System.currentTimeMillis() - startTime) / 100) % 1000;
        }
        return elapsed;
    }

    //elaspsed time in seconds
    public long getElapsedTimeSecs() {
        long elapsed = 0;
        if (running) {
            elapsed = ((System.currentTimeMillis() - startTime) / 1000) % 60;
        } else {
            elapsed = ((LastPastTime - startTime) / 1000) % 60;
        }
        return elapsed;
    }

    public long getcurentSecends() {
        if (running) {
            return ((System.currentTimeMillis() - startTime) / 1000) % 60;
        } else {
            return ((LastPastTime - startTime) / 1000) % 60;
        }

    }

    //elaspsed time in minutes
    public long getElapsedTimeMin() {
        long elapsed = 0;
        if (running) {
            elapsed = (((System.currentTimeMillis() - startTime) / 1000) / 60) % 60;
        } else {
            elapsed = (((LastPastTime - startTime) / 1000) / 60) % 60;
        }
        return elapsed;
    }

    //elaspsed time in hours
    public long getElapsedTimeHour() {
        long elapsed = 0;
        if (running) {
            elapsed = ((((System.currentTimeMillis() - startTime) / 1000) / 60) / 60);
        } else {
            elapsed = ((((LastPastTime - startTime) / 1000) / 60) / 60);
        }
        return elapsed;
    }

    public String toString() {
        return padZero(getElapsedTimeHour()) + ":" + padZero(getElapsedTimeMin()) + ":"
                + padZero(getElapsedTimeSecs());
    }

    public String getcurrentime() {
        return padZero(getElapsedTimeHour()) + ":" + padZero(getElapsedTimeMin()) + ":"
                + padZero(getElapsedTimeSecs());
    }

    public long getTotalTimeElapsed() {
        return (getElapsedTimeHour() * 60 * 60 + getElapsedTimeMin() * 60 + getElapsedTimeSecs()) * 1000;
    }

    public boolean isRunning() {
        return running;
    }

    public void setListener(StopWatchListener listener) {
        this.listener = listener;
    }

    private String padZero(long time) {
        if (time < 10)
            return "0" + time;
        return String.valueOf(time);
    }

    private StopWatchListener listener = null;
}

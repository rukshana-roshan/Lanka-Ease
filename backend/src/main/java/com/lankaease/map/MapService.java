package com.lankaease.map;

public interface MapService {
    double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2);
    int estimateTravelTimeMinutes(double distanceKm);
}

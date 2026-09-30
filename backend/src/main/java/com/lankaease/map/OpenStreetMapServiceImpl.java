package com.lankaease.map;

import org.springframework.stereotype.Service;

@Service
public class OpenStreetMapServiceImpl implements MapService {

    private static final double EARTH_RADIUS_KM = 6371.0;

    @Override
    public double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        double distance = EARTH_RADIUS_KM * c;
        return Math.round(distance * 100.0) / 100.0;
    }

    @Override
    public int estimateTravelTimeMinutes(double distanceKm) {
        // Average speed in Sri Lankan urban traffic ~ 25 km/h + 5 mins buffer
        double travelHours = distanceKm / 25.0;
        int minutes = (int) Math.round(travelHours * 60) + 5;
        return Math.max(minutes, 10);
    }
}

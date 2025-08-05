package ai.docbrain.service.utils;

import ai.docbrain.domain.users.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

public class ServerUtils {

    private static final Map<String, MediaType> MEDIA_TYPE_MAP = new HashMap<>();

    static {
        MEDIA_TYPE_MAP.put("txt", MediaType.TEXT_PLAIN);
        MEDIA_TYPE_MAP.put("html", MediaType.TEXT_HTML);
        MEDIA_TYPE_MAP.put("css", MediaType.valueOf("text/css"));
        MEDIA_TYPE_MAP.put("csv", MediaType.valueOf("text/csv"));
        MEDIA_TYPE_MAP.put("xml", MediaType.APPLICATION_XML);
        MEDIA_TYPE_MAP.put("json", MediaType.APPLICATION_JSON);
        MEDIA_TYPE_MAP.put("pdf", MediaType.APPLICATION_PDF);
        //MEDIA_TYPE_MAP.put("zip", MediaType.APPLICATION_ZIP);
        MEDIA_TYPE_MAP.put("jpeg", MediaType.IMAGE_JPEG);
        MEDIA_TYPE_MAP.put("jpg", MediaType.IMAGE_JPEG);
        MEDIA_TYPE_MAP.put("png", MediaType.IMAGE_PNG);
        MEDIA_TYPE_MAP.put("gif", MediaType.IMAGE_GIF);
        MEDIA_TYPE_MAP.put("bmp", MediaType.valueOf("image/bmp"));
        MEDIA_TYPE_MAP.put("mp3", MediaType.valueOf("audio/mpeg"));
        MEDIA_TYPE_MAP.put("mpR4", MediaType.valueOf("video/mp4"));
    }

    private ServerUtils() {
    }

    public static ResponseEntity<String> getResponseEntity(String responseMessage, HttpStatus httpStatus) {
        return new ResponseEntity<String>("{\"message\":\"" + responseMessage + "\"}", httpStatus);
    }

    public static MediaType getMediaType(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return MediaType.APPLICATION_OCTET_STREAM; // Default media type for unknown files
        }

        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

        return MEDIA_TYPE_MAP.getOrDefault(extension, MediaType.APPLICATION_OCTET_STREAM);
    }

    public static String sanitizeFileName(String originalFilename) {
        return originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");
    }

//    public static boolean hasPermission(User currentUser, String requiredRole) {
//        return currentUser.getRoles().name().equalsIgnoreCase(requiredRole);
//    }

}

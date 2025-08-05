package ai.docbrain.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import static jakarta.persistence.EnumType.STRING;

@NoArgsConstructor
@AllArgsConstructor
@Data
@MappedSuperclass
public class BaseEntity {
    @Transient
    private String applicationTimeZone = "UTC";

    @Column(name = "status_code", nullable = true, updatable = true)
    @Enumerated(STRING)
    private StatusCodes statusCode;

    @CreatedDate
    @Column(name = "created_at", nullable = true, updatable = false)
    private ZonedDateTime createdAt;

    @CreatedBy
    @Column(name = "created_by", nullable = true, updatable = false)
    private String createdBy;

    @LastModifiedDate
    @Column(name = "last_modified_at")
    private ZonedDateTime lastModifiedAt;

    @LastModifiedBy
    @Column(name = "last_modified_by", nullable = true, updatable = true)
    private String lastModifiedBy;

    // Formatting methods
    public String getCreatedAtFormatted() {
        return formatZonedDateTime(createdAt);
    }

    public String getLastModifiedAtFormatted() {
        return formatZonedDateTime(lastModifiedAt);
    }

    private String formatZonedDateTime(ZonedDateTime dateTime) {
        if (dateTime != null) {
            ZonedDateTime localDateTime = dateTime.withZoneSameInstant(ZoneId.of(applicationTimeZone));
            return localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        }
        return "";
    }


    // getters and setters
    public StatusCodes getStatusCode () {
        return statusCode == null ? StatusCodes.ACTIVE : statusCode;
    }

//    public void setStatusCode (StatusCodes statusCode) {
//        this.statusCode = statusCode;
//    }
//
//
//    public void setCreatedBy (String createdBy) {
//        this.createdBy = createdBy;
//    }
//
//
//    public void setLastModifiedBy (String lastModifiedBy) {
//        this.lastModifiedBy = lastModifiedBy;
//    }

    @PrePersist
    public void prePersist() {
        ZoneId zoneId = ZoneId.of(applicationTimeZone);
        this.createdAt = ZonedDateTime.now(zoneId);
        this.lastModifiedAt = ZonedDateTime.now(zoneId);
        if (this.statusCode == null) { // Only set to ACTIVE if statusCode is not already set
            this.statusCode = StatusCodes.ACTIVE;
        }
    }

    @PreUpdate
    public void preUpdate () {
        ZoneId zoneId = ZoneId.of(applicationTimeZone);
        this.lastModifiedAt = ZonedDateTime.now(zoneId);
        if (this.statusCode == null) {
            this.statusCode = StatusCodes.ACTIVE;
        }
    }

    public enum StatusCodes {ACTIVE, INACTIVE}
}
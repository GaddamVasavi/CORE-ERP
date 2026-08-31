package com.coreerp.domain.document.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.security.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "documents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Document extends TenantAwareEntity {

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_type", nullable = false, length = 100)
    private String fileType;

    @Column(name = "file_size_bytes", nullable = false)
    private Long fileSizeBytes;

    @Column(name = "storage_path", nullable = false, length = 500)
    private String storagePath;

    @Column(name = "entity_type", length = 100)
    private String entityType;

    @Column(name = "entity_id", length = 100)
    private String entityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_user_id")
    private User uploadedBy;

    @Column(name = "version", nullable = false)
    @Builder.Default
    private int version = 1;

    @Column(name = "is_archived", nullable = false)
    @Builder.Default
    private boolean isArchived = false;
}

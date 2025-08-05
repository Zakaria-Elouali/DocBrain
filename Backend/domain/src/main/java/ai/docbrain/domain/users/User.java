

package ai.docbrain.domain.users;
import ai.docbrain.domain.BaseEntity;
import ai.docbrain.domain.role.Permission;
import ai.docbrain.domain.role.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@Builder
public class User extends BaseEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone")
    private String phone;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "profile_picture_size")
    private Long profilePictureSize;

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "date_of_birth")
    private Date dateOfBirth;


    @Column(name = "company_id")
    private Long companyId;


    @Column(name = "two_factor_enabled")
    private Boolean twoFactorEnabled;

    @Column(name = "notifications_enabled")
    private Boolean notificationsEnabled;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinTable(
            name = "user_roles", // Name of the join table
            joinColumns = @JoinColumn(name = "user_id"), // Foreign key column in the join table for User
            inverseJoinColumns = @JoinColumn(name = "role_id") // Foreign key column in the join table for Role
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>(); // Use HashSet to ensure uniqueness of roles

    @ElementCollection
    @CollectionTable(name = "user_blocked_folders", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "folder_id")
    private Set<Long> blockedFolderIds; // IDs of folders blocked for this user


    // Additional methods for convenience
    public void addRole(Role role) {
        roles.add(role);
    }

    public void removeRole(Role role) {
        roles.remove(role);
    }

    // Store authorities separately from roles to handle cases where roles might not be loaded
    @Transient
    private Set<GrantedAuthority> authorities;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // If authorities have been explicitly set, use them
        if (authorities != null && !authorities.isEmpty()) {
            return authorities;
        }
        // Otherwise, derive them from roles if available
        if (roles != null && !roles.isEmpty()) {
            return roles.stream()
                    .flatMap(role -> role.getPermissions().stream())
                    .map(permission -> new SimpleGrantedAuthority(permission.getName()))
                    .collect(Collectors.toSet());
        }
        // Return empty set if no roles or authorities
        return Collections.emptySet();
    }

    // Method to set authorities directly (used when roles aren't loaded but we have permission names)
    public void setAuthorities(Set<GrantedAuthority> authorities) {
        this.authorities = authorities;
    }

    // Method to set roles directly from role names
    public void setRolesFromNames(Set<String> roleNames, Set<String> permissionNames) {
        if (roleNames == null || roleNames.isEmpty()) {
            return;
        }

        // Create roles from names
        Set<Role> newRoles = new HashSet<>();
        for (String roleName : roleNames) {
            Role role = new Role();
            role.setName(roleName);

            // Create permissions for this role
            Set<Permission> permissions = new HashSet<>();
            for (String permName : permissionNames) {
                Permission perm = new Permission();
                perm.setName(permName);
                permissions.add(perm);
            }

            role.setPermissions(permissions);
            newRoles.add(role);
        }

        // Set the roles
        this.roles = newRoles;
    }


    @Override
    public String getUsername() {
        return this.email;
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    public boolean isEnabled() {
        return true;
    }

}



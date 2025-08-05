package ai.docbrain.persistence.core;

import jakarta.persistence.EntityManagerFactory;
import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationInitializer;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableJpaRepositories(basePackages =
        {
                "ai.docbrain.persistence.core",
                "ai.docbrain.persistence.users",
                "ai.docbrain.persistence.role",
                "ai.docbrain.persistence.jwt",
                "ai.docbrain.persistence.company",
                "ai.docbrain.persistence.fileManagement",
                "ai.docbrain.persistence.calendar",
                "ai.docbrain.persistence.AI",
                "ai.docbrain.persistence.invoice"
        },
        entityManagerFactoryRef = "coreEntityManagerFactory",
        transactionManagerRef = "coreTransactionManager")

public class CoreJpaConfig {

  @Bean(name = "coreDataSource")
  @ConfigurationProperties(prefix = "spring.datasource.core")
  public DataSource dataSource() {
    return DataSourceBuilder.create().build();

  }

    @Bean
    public EntityManagerFactoryBuilder entityManagerFactoryBuilder() {
        JpaVendorAdapter jpaVendorAdapter = new HibernateJpaVendorAdapter();

        // Provide non-null JPA properties
        Map<String, Object> jpaProperties = new HashMap<>();
        jpaProperties.put("hibernate.hbm2ddl.auto", "update");
        jpaProperties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");

        return new EntityManagerFactoryBuilder(jpaVendorAdapter, jpaProperties, null);
    }

    @Bean(name = "coreEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory (
            EntityManagerFactoryBuilder builder, @Qualifier("coreDataSource") DataSource dataSource) {
        return builder.dataSource(dataSource)
                .packages(
                        "ai.docbrain.domain.config",
                        "ai.docbrain.domain.core",
                        "ai.docbrain.domain.users",
                        "ai.docbrain.domain.role",
                        "ai.docbrain.domain.company",
                        "ai.docbrain.domain.jwt",
                        "ai.docbrain.domain.fileManagement",
                        "ai.docbrain.domain.calendar",
                        "ai.docbrain.domain.AI",
                        "ai.docbrain.domain.invoice"
                )
                .persistenceUnit("jpa")
                .build();
    }

  @Primary
  @Bean(name = "coreTransactionManager")
  public PlatformTransactionManager transactionManager(
      @Qualifier("coreEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
    return new JpaTransactionManager(entityManagerFactory);
  }


  @Bean(name = "flywayCore")
  @DependsOn("coreDataSource")
  public Flyway flywayCore(@Qualifier("coreDataSource") DataSource dataSource) {
    Flyway flyway =
                Flyway.configure()
                        .dataSource(dataSource)
                        .locations("classpath:db/migration/core",
                                "classpath:db/migration/main"
                        )
                        .outOfOrder(true).load();
        flyway.repair();
        flyway.migrate();
        return flyway;
    }

//    @Bean(name = "flywayCore")
////    @DependsOn("coreDataSource")
//    public Flyway flywayCore(@Qualifier("coreDataSource") DataSource dataSource) {
//        Flyway flyway = Flyway.configure()
//                .dataSource(dataSource)
//                .locations(
//                        "classpath:db/migration/core",
//                        "classpath:db/migration/main"
//                )
//                .baselineOnMigrate(true)
//                .baselineVersion("0")
//                .outOfOrder(true)
//                .validateOnMigrate(true)
//                .cleanDisabled(true)
//                .placeholderReplacement(true)
//                .schemas("public")
//                .table("flyway_schema_history")
//                .sqlMigrationPrefix("V")
//                .sqlMigrationSeparator("__")
//                .sqlMigrationSuffixes(".sql")
//                .mixed(true)  // Allow mixed migrations (versioned and repeatable)
//                .ignoreMigrationPatterns("*:pending")  // Ignore pending migrations
//                .load();
//        return flyway;
//    }
}

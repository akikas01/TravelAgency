using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace TravelAgency.Models;

public partial class TRAVEL_AGENCYContext : DbContext
{
    public TRAVEL_AGENCYContext()
    {
    }

    public TRAVEL_AGENCYContext(DbContextOptions<TRAVEL_AGENCYContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<Country> Countries { get; set; }

    public virtual DbSet<Destination> Destinations { get; set; }

    public virtual DbSet<TravelPackage> TravelPackages { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)

        => optionsBuilder.UseSqlServer("Server=LAPTOP-A7HAC4VK;Database=TRAVEL_AGENCY;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Booking>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("BOOKING");

            entity.Property(e => e.TravelPackage)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("TRAVEL_PACKAGE");
            entity.Property(e => e.User)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("USER");

            entity.HasOne(d => d.TravelPackageNavigation).WithMany()
                .HasForeignKey(d => d.TravelPackage)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOKING_TRAVEL_PACKAGE1");

            entity.HasOne(d => d.UserNavigation).WithMany()
                .HasForeignKey(d => d.User)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOKING_USER");
        });

        modelBuilder.Entity<Country>(entity =>
        {
            entity.HasKey(e => e.Name);

            entity.ToTable("COUNTRY");

            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NAME");
        });

        modelBuilder.Entity<Destination>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("DESTINATIONS");

            entity.Property(e => e.Country)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.TravelPackage)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("TRAVEL_PACKAGE");

            entity.HasOne(d => d.CountryNavigation).WithMany()
                .HasForeignKey(d => d.Country)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DESTINATIONS_COUNTRY");

            entity.HasOne(d => d.TravelPackageNavigation).WithMany()
                .HasForeignKey(d => d.TravelPackage)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DESTINATIONS_TRAVEL_PACKAGE");
        });

        modelBuilder.Entity<TravelPackage>(entity =>
        {
            entity.HasKey(e => e.Title);

            entity.ToTable("TRAVEL_PACKAGE");

            entity.Property(e => e.Title)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("TITLE");
            entity.Property(e => e.Description)
                .IsUnicode(false)
                .HasColumnName("DESCRIPTION");
            entity.Property(e => e.Price).HasColumnName("PRICE");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Username);

            entity.ToTable("USER");

            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("USERNAME");
            entity.Property(e => e.Password)
                .IsUnicode(false)
                .HasColumnName("PASSWORD");
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .HasColumnName("ROLE");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

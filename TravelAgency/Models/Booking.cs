using System;
using System.Collections.Generic;

namespace TravelAgency.Models;

public partial class Booking
{
    public string TravelPackage { get; set; } = null!;

    public string User { get; set; } = null!;

    public virtual TravelPackage? TravelPackageNavigation { get; set; } = null!;

    public virtual User? UserNavigation { get; set; } = null!;
}

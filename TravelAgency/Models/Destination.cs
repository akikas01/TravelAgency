using System;
using System.Collections.Generic;

namespace TravelAgency.Models;

public partial class Destination
{
    public string Country { get; set; } = null!;

    public string TravelPackage { get; set; } = null!;

    public virtual Country CountryNavigation { get; set; } = null!;

    public virtual TravelPackage TravelPackageNavigation { get; set; } = null!;
}

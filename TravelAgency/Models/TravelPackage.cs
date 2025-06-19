using System;
using System.Collections.Generic;

namespace TravelAgency.Models;

public partial class TravelPackage
{
    public string Title { get; set; } = null!;

    public int Price { get; set; }

    public string? Description { get; set; }
}

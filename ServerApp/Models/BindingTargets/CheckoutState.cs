namespace ServerApp.Models.BindingTargets
{
  public class CheckoutState
  {
    public string name { get; set; } = string.Empty;
    public string address { get; set; } = string.Empty;
    public string cardNumber { get; set; } = string.Empty;
    public string cardExpiry { get; set; } = string.Empty;
    public string cardSecurityCode { get; set; } = string.Empty;
  }
}

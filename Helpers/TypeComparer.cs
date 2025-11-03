using System.Reflection;

namespace Helpers
{
  public static class TypeComparer
  {
    public static bool HaveSameProperties<TSource, TTarget>(string[] excludedSourceProperties)
    {
      Type typeSource = typeof(TSource);
      Type typeTarget = typeof(TTarget);

      // Exclude any properties that are in the excluded list.
      PropertyInfo[] propertiesSource = [.. typeSource
        .GetProperties(BindingFlags.Public | BindingFlags.Instance)
        .Where(p => !excludedSourceProperties.Contains(p.Name))];

      PropertyInfo[] propertiesTarget = typeTarget.GetProperties(BindingFlags.Public | BindingFlags.Instance);

      foreach (PropertyInfo propS in propertiesSource)
      {
        PropertyInfo? matchingPropT = propertiesTarget.FirstOrDefault(p => p.Name == propS.Name && p.PropertyType == propS.PropertyType);

        if (matchingPropT == null)
        {
          return false;
        }
      }

      return true;
    }
  }
}

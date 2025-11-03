using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Helpers
{
  public class JsonPatchDocumentHelper
  {
    public static JsonPatchDocument<TModelTarget>? CreateCopyOfOperations<TModelSource, TModelTarget>(JsonPatchDocument<TModelSource> sourcePatchDocument, string[]? excludedProperties = null)
    where TModelSource : class
    where TModelTarget : class
    {
      excludedProperties ??= [];

      if (TypeComparer.HaveSameProperties<TModelSource, TModelTarget>(excludedProperties))
      {
        var newPatchDocument = new JsonPatchDocument<TModelTarget>();

        foreach (var operation in sourcePatchDocument.Operations)
        {
          newPatchDocument.Operations.Add(new Operation<TModelTarget>(operation.op, operation.path, operation.from, operation.value));
        }

        return newPatchDocument;
      }

      return null;
    }

    public static JsonPatchDocument CreateCopyOfOperations(JsonPatchDocument sourcePatchDocument)
    {
      var newPatchDocument = new JsonPatchDocument();

      foreach (var operation in sourcePatchDocument.Operations)
      {
        newPatchDocument.Operations.Add(new Operation(operation.op, operation.path, operation.from, operation.value));
      }

      return newPatchDocument;
    }

    /// <summary>
    /// Guard for patch operations.
    /// </summary>
    /// <param name="patch">Strongly-typed JsonPatchDocument.</param>
    /// <param name="numAllowedOperations">Number of permissible operations.</param>
    /// <param name="curOperation">Type of allowed operation.</param>
    /// <exception cref="InvalidOperationException"></exception>
    /// <example>JsonPatchDocumentHelper.ValidatePatch(patch, typeof(MyClass), 2, OperationType.Replace);</example>
    /// <returns>void</returns>
    public static void ValidatePatch<TModel>(ModelStateDictionary model, JsonPatchDocument<TModel> patch, int numAllowedOperations, OperationType curOperation)
      where TModel : class
    {
      var currentModelInstance = Activator.CreateInstance<TModel>() ??
        throw new Exception("Could not create an instance of the current model.");

      if (patch.Operations.Count > numAllowedOperations)
      {
        model.AddModelError("PatchError", $"Patch document operations count ({patch.Operations.Count}) exceeds permissible operations ({numAllowedOperations}).");
        return;
      }

      if (patch.Operations.Any(p => p.OperationType != curOperation))
      {
        model.AddModelError("PatchError", $"Invalid Patch operation.");
        return;
      }

      foreach (var operation in patch.Operations)
      {
        if (!PathExists(currentModelInstance, operation.path))
        {
          model.AddModelError("PatchError", $"Invalid patch document: no match found for specified path: {operation.path}.");
          return;
        }

        switch (operation.op)
        {
          case "add":
            IsValidForProperty(model, currentModelInstance, operation.path, operation.value);
            IsPropertyInRange(model, currentModelInstance, operation.path, operation.value);
            break;
          case "replace":
            IsValidForProperty(model, currentModelInstance, operation.path, operation.value);
            IsPropertyInRange(model, currentModelInstance, operation.path, operation.value);
            break;
        }
      }
    }

    private static void IsValidForProperty<TModel>(ModelStateDictionary model, TModel currentModel, string path, object? val) where TModel : class
    {
      var property = currentModel.GetType().GetProperty(path, BindingFlags.Instance | BindingFlags.Public | BindingFlags.IgnoreCase);

      Type propertyType = property!.PropertyType;

      var success = propertyType.IsAssignableFrom(val!.GetType());

      if (success == false)
      {
        throw new InvalidOperationException("Value type is not valid for property.");
      }
    }

    private static void IsPropertyInRange<TModel>(ModelStateDictionary model, TModel currentModel, string path, object? val) where TModel : class
    {
      var property = currentModel.GetType().GetProperty(path, BindingFlags.Instance | BindingFlags.Public | BindingFlags.IgnoreCase);

      foreach (var item in property!.GetCustomAttributes(false).OfType<ValidationAttribute>())
      {
        try
        {
          item.Validate(val, new ValidationContext(currentModel));
        }
        catch (ValidationException ex)
        {
          model.AddModelError(path, ex.Message);
        }
      }
    }

    private static bool PathExists<TModel>(TModel currentModel, string path) where TModel : class
    {
      var property = currentModel.GetType().GetProperty(path, BindingFlags.Instance | BindingFlags.Public | BindingFlags.IgnoreCase);

      if (property is null) return false;

      return true;
    }
  }
}

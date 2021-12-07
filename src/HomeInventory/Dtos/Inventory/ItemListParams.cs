using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using HomeInventory.Models;

namespace HomeInventory.Dtos.Inventory
{
    public class ItemListParams
    {
        public string Name { get; init; }
        public string SerialNumber { get; init; }
        public string Description { get; init; }
        public int? ItemLocationId { get; init; }
        public int? ItemConditionId { get; init; }
        public double? WeightHeavierThen { get; init; }
        public double? WeightLighterThen { get; init; }

        public IEnumerable<Expression<Func<Item, bool>>> BuildQuery()
        {
            var criteria = new List<Expression<Func<Item, bool>>>();

            if (!string.IsNullOrEmpty(Name))
                criteria.Add(x => x.Name.Contains(Name));
            if (!string.IsNullOrEmpty(Description))
                criteria.Add(x => x.Description.Contains(Description));
            if (!string.IsNullOrEmpty(SerialNumber))
                criteria.Add(x => x.SerialNumber.Contains(SerialNumber));
            if (ItemLocationId != null)
                criteria.Add(x => x.ItemLocation.Id == ItemLocationId);
            if (ItemConditionId != null)
                criteria.Add(x => x.Condition.Id == ItemConditionId);
            if (WeightHeavierThen != null)
                criteria.Add(x => x.Weight > WeightHeavierThen);
            if (WeightLighterThen != null)
                criteria.Add(x => x.Weight < WeightLighterThen);

            return criteria;
        }
    }
}

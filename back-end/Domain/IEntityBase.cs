namespace back_end.Domain
{
    public interface IEntityBase<TKey>
    {
        public TKey Id { get; set; }
    }
}

namespace back_end.Domain
{
    public class Administrator : UserBase, IEntityBase<ulong>
    {
        public ulong Id { get; set; }
    }
}

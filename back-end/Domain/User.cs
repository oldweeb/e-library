namespace back_end.Domain
{
    public class User : UserBase, IEntityBase<ulong>
    {
        public ulong Id { get; set; }
    }
}

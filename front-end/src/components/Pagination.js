import {Pagination as PageList} from 'react-bootstrap';

const range = (size, startAt = 0) => {
  return [...Array(size).keys()].map(i => i + startAt);
};

const Pagination = (props) => {
  const {pageCount, active} = props;
  
  if (pageCount === 1) {
    return (
      <PageList size='lg'>
        <PageList.Item active>{1}</PageList.Item>
      </PageList>
    );
  }
  
  const firstPrev = (
    <>
      <PageList.First onClick={() => props.setSearchParams({p: 1})} />
      <PageList.Prev onClick={() => props.setSearchParams({p: active - 1})} />
    </>
  );
  
  const nextLast = (
    <>
      <PageList.Next onClick={() => props.setSearchParams({p: active + 1})} />
      <PageList.Last onClick={() => props.setSearchParams({p: pageCount})} />
    </>
  );
  
  const minPageCount = 1;
  const maxPageCountWithoutArrows = 8;
  const pageCountPerView = 7;
  
  const count = pageCount > minPageCount && pageCount < maxPageCountWithoutArrows
    ? pageCount
    : pageCountPerView;
  
  let startAt = 1;
  
  if (pageCount >= maxPageCountWithoutArrows) {
    const diff = pageCount - active;
    startAt = diff < active ? active - (3 + diff - 1) : active - 3;
    startAt = startAt <= 0 ? 1 : startAt;
    startAt = startAt + count > pageCount ? pageCount - 6 : startAt;
  }
  
  return (
    <PageList size='lg'>
      {active !== 1 && firstPrev}
      {range(count, startAt).map(page => (
        <PageList.Item
          key={page}
          active={page === active}
          onClick={() => {props.setSearchParams({p: page})}}
        >
          {page}
        </PageList.Item>
      ))}
      {active !== pageCount && nextLast}
    </PageList>
  );
};

export default Pagination;
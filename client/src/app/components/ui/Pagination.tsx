import { useCallback } from 'react';
import { Button, Flex } from '@radix-ui/themes';

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePageIncrement = useCallback(() => {
    onPageChange(currentPage + 1);
  }, [currentPage, onPageChange]);

  const handlePageDecrement = useCallback(() => {
    onPageChange(currentPage - 1);
  }, [currentPage, onPageChange]);

  return (
    <Flex gap="2" justify="end">
      <Button color="gray" variant="outline" disabled={currentPage === 1} onClick={handlePageDecrement}>Previous</Button>
      <Button color="gray" variant="outline" disabled={currentPage === totalPages} onClick={handlePageIncrement}>Next</Button>
    </Flex>
  );
};

export default Pagination;
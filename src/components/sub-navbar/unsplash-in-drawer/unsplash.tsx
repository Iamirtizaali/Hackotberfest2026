import React, { useState, useEffect } from 'react';
import { createApi } from 'unsplash-js';
import { updateBoardDetail } from '@/src/slices/board';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/src/hooks';
import { Box, InputGroup, Input, InputLeftElement, Button, Text } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

const Unsplash = () => {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasError, setHasError] = useState(false);

  const dispatch = useDispatch();
  const selectedImage = useAppSelector((state) => state.board.board.backgroundImage);
  const unsplash = createApi({ accessKey: process.env.NEXT_PUBLIC_UNSPLASH_API });

  useEffect(() => {
    async function fetchImages() {
      await findImages();
    }

    fetchImages();
  }, []);

  const searchPhotos = async (query: string, page: number) => {
    try {
      const result = await unsplash.search.getPhotos({
        query,
        page,
        perPage: 10,
        orientation: 'landscape'
      });

      setHasError(!result.response);

      return result.response?.results || [];
    } catch (error) {
      setHasError(true);

      return [];
    }
  };

  const findImages = async (query = 'nature') => {
    setIsLoading(true);
    setCurrentPage(1);
    setImages(await searchPhotos(query || 'nature', 1));
    setIsLoading(false);
  };

  const loadMoreImages = async () => {
    setIsLoading(true);
    const nextImages = await searchPhotos(value || 'nature', currentPage + 1);

    setCurrentPage(currentPage + 1);
    setImages(images.concat(nextImages));
    setIsLoading(false);
  };

  const handleImageClick = async (imageURL) => {
    const data = {
      type: 'backgroundImage',
      value: imageURL
    };

    await dispatch(updateBoardDetail(data));
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          findImages(value);
        }}>
        <InputGroup>
          <InputLeftElement pointerEvents="none" color="muted">
            <FiSearch />
          </InputLeftElement>
          <Input
            type="search"
            aria-label="Search photos"
            placeholder="Search photos, e.g. mountains"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </InputGroup>
      </form>
      {hasError && images.length === 0 && (
        <Text mt="16px" fontSize="14px" color="muted">
          Photos couldn&apos;t be loaded. Check that an Unsplash access key is set in
          NEXT_PUBLIC_UNSPLASH_API.
        </Text>
      )}
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gridGap="10px" mt="16px">
        {images.map((item) => {
          const isSelected = selectedImage === item.urls.regular;

          return (
            <Box
              as="button"
              type="button"
              key={item.id}
              aria-label={item.alt_description || 'Unsplash photo'}
              aria-pressed={isSelected}
              backgroundImage={`url('${item.urls.small}')`}
              backgroundSize="cover"
              backgroundPosition="center"
              borderRadius="tile"
              paddingTop="66%"
              outline={isSelected ? '2px solid #2B44C7' : 'none'}
              outlineOffset="2px"
              transition="opacity 120ms"
              _hover={{ opacity: 0.85 }}
              onClick={() => handleImageClick(item.urls.regular)}
            />
          );
        })}
      </Box>
      {images.length > 0 && (
        <Box display="flex" justifyContent="center" mt="20px">
          <Button
            onClick={loadMoreImages}
            size="sm"
            variant="outline"
            borderColor="lineStrong"
            isLoading={isLoading}
            loadingText="Loading">
            Load more
          </Button>
        </Box>
      )}
    </>
  );
};

export default Unsplash;

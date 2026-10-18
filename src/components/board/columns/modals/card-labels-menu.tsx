import React, { FC } from 'react';
import { Box, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { updateCard } from '@/src/slices/cards';
import { useDispatch } from 'react-redux';
import { Label } from '@/src/types/cards';
import { palette } from '@/src/theme';
import LabelChip from '@/src/components/board/columns/label-chip';

type IProps = {
  id: string;
  boardId: string;
  value?: Label;
  onChange: (label: Label | null) => void;
};

export const cardLabels: Label[] = [
  { type: 'performance', bg: palette.lapis },
  { type: 'bug', bg: palette.rose },
  { type: 'feature', bg: palette.verdigris },
  { type: 'information', bg: palette.ochre },
  { type: 'warning', bg: palette.saffron }
];

const CardLabel: FC<IProps> = ({ id, boardId, value, onChange }) => {
  const dispatch = useDispatch();

  const handleClick = async (label: Label | null) => {
    onChange(label);

    const data = {
      _id: id,
      boardId,
      label
    };

    await dispatch(updateCard(data));
  };

  return (
    <Menu matchWidth>
      <MenuButton
        as={Button}
        size="sm"
        width="100%"
        variant="outline"
        borderColor="line"
        bg="surface"
        fontWeight={400}
        textAlign="left"
        rightIcon={<FiChevronDown />}>
        {value?.type ? (
          <LabelChip type={value.type} />
        ) : (
          <Box as="span" color="muted">
            None
          </Box>
        )}
      </MenuButton>
      <MenuList>
        {cardLabels.map((item) => (
          <MenuItem key={item.type} onClick={() => handleClick(item)}>
            <LabelChip type={item.type} />
          </MenuItem>
        ))}
        <MenuDivider borderColor="line" />
        <MenuItem onClick={() => handleClick(null)}>Remove label</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default CardLabel;

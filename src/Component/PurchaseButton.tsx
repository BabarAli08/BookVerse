interface Button {
  title: string;
  color: string;
  onClick: () => void;
}

const PurchaseButton = ({ title, color, onClick }: Button) => {
  let bgColor = '';

  if (color === 'gray') bgColor = 'bg-[#4b5563]';
  else if (color === 'purple') bgColor = 'bg-[#9333ea]';
  else if (color === 'yellow') bgColor = 'bg-[#ca8a04]';
  else bgColor = 'bg-white text-black';

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center w-[90%] hover:border hover  transition-all duration-200 h-[3rem] rounded-md ${bgColor} text-white cursor-pointer`}
    >
      {title}
    </div>
  );
};

export default PurchaseButton;

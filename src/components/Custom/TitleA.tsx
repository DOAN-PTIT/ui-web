interface TitleProps {
    title: React.ReactNode;
}

export default function TitleA({ title }: TitleProps) {
    return (
        <div className="text-xs font-normal text-[#475467]">
            {title}
        </div>
    );
}


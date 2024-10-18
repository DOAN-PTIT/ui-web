import clsx from 'clsx';

interface TitleProps {
    title: React.ReactNode;
    className?: string; // Cho phép truyền className từ ngoài vào

}

export default function TitleLabel({ title, className }: TitleProps) {
    return (
        <div className={clsx("text-sm font-normal mb-2 text-[#475467]",className)}>
            {title}
        </div>
    );
}


import clsx from 'clsx';
interface TitleProps {
    title: React.ReactNode;
    className?: string; // Cho phép truyền className từ ngoài vào

}

export default function TitleA({ title, className }: TitleProps) {
    return (
        <div className={clsx("text-xs font-normal text-[#475467]",className)}>
            {title}
        </div>
    );
}


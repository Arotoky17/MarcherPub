import 'package:flutter/material.dart';
import '../utils/constants.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isSecondary;
  final IconData? icon;
  final double? width;
  final double height;

  const CustomButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.isSecondary = false,
    this.icon,
    this.width,
    this.height = AppSizes.buttonHeight,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: isSecondary ? Colors.transparent : AppColors.primary,
          foregroundColor: isSecondary ? AppColors.primary : Colors.white,
          elevation: isSecondary ? 0 : 2,
          shadowColor: AppColors.primary.withOpacity(0.3),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSizes.radiusMd),
            side: isSecondary 
                ? const BorderSide(color: AppColors.primary, width: 2)
                : BorderSide.none,
          ),
          padding: const EdgeInsets.symmetric(horizontal: AppSizes.lg),
        ),
        child: isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
            : Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: 20),
                    const SizedBox(width: AppSizes.sm),
                  ],
                  Text(
                    text,
                    style: isSecondary 
                        ? AppTextStyles.buttonSecondary
                        : AppTextStyles.button,
                  ),
                ],
              ),
      ),
    );
  }
}

class CustomIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onPressed;
  final Color? backgroundColor;
  final Color? iconColor;
  final double size;
  final String? tooltip;

  const CustomIconButton({
    super.key,
    required this.icon,
    this.onPressed,
    this.backgroundColor,
    this.iconColor,
    this.size = 48,
    this.tooltip,
  });

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: tooltip ?? '',
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: backgroundColor ?? AppColors.primary,
          borderRadius: BorderRadius.circular(size / 2),
          boxShadow: [
            BoxShadow(
              color: (backgroundColor ?? AppColors.primary).withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onPressed,
            borderRadius: BorderRadius.circular(size / 2),
            child: Icon(
              icon,
              color: iconColor ?? Colors.white,
              size: size * 0.4,
            ),
          ),
        ),
      ),
    );
  }
}

class CustomTextButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final Color? textColor;
  final TextStyle? textStyle;
  final IconData? icon;

  const CustomTextButton({
    super.key,
    required this.text,
    this.onPressed,
    this.textColor,
    this.textStyle,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        foregroundColor: textColor ?? AppColors.primary,
        padding: const EdgeInsets.symmetric(
          horizontal: AppSizes.md,
          vertical: AppSizes.sm,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 18),
            const SizedBox(width: AppSizes.xs),
          ],
          Text(
            text,
            style: textStyle ?? AppTextStyles.buttonSecondary.copyWith(
              fontSize: 14,
              color: textColor ?? AppColors.primary,
            ),
          ),
        ],
      ),
    );
  }
}

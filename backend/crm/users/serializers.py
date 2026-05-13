from rest_framework import serializers
from django.core.mail import send_mail
from django.conf import settings
from .models import User

class UserSerializer(serializers.ModelSerializer):
    camp_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'password', 'camp', 'camp_name']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
        }

    def get_camp_name(self, obj):
        return obj.camp.name if obj.camp else None

    def validate(self, data):

        return data

    def create(self, validated_data):
        import secrets
        import string
        
        # Auto-generate password if not provided
        raw_password = validated_data.pop('password', None)
        if not raw_password:
            alphabet = string.ascii_letters + string.digits
            raw_password = ''.join(secrets.choice(alphabet) for i in range(10))
            
        role = validated_data.pop('role', 'sales')
        user = User(**validated_data)
        user.role = role
        user.set_password(raw_password)
        user.save()

        # Send Email Notification
        if user.email:
            print(f"DEBUG: Attempting to send creation email to {user.email}...")
            subject = "Welcome to Y CRM - Your Account is Ready"
            message = f"""
Hi {user.username},

Your account has been created on the Y CRM platform with the role of '{user.role.upper()}'.

Login Credentials:
------------------
Username: {user.username}
Password: {raw_password}

Login here: http://localhost:3000/login

Please change your password after logging in for security.

Best Regards,
The Y CRM Team
            """
            try:
                sent = send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
                print(f"DEBUG: Email sent status: {sent}")
            except Exception as e:
                print(f"DEBUG ERROR: Failed to send email: {e}")
        else:
            print("DEBUG: No email address provided for user, skipping notification.")

        return user

    def update(self, instance, validated_data):
        old_role = instance.role
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()

        # Send email if role changed
        if 'role' in validated_data and validated_data['role'] != old_role:
            print(f"DEBUG: Role changed for {instance.username}, sending notification to {instance.email}...")
            subject = "Your Role has been Updated - Y CRM"
            message = f"""
Hi {instance.username},

Your role on the Y CRM platform has been updated.

New Role: {instance.role.upper()}

Login here: http://localhost:3000/login

Best Regards,
The Y CRM Team
            """
            try:
                sent = send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [instance.email],
                    fail_silently=False,
                )
                print(f"DEBUG: Update email sent status: {sent}")
            except Exception as e:
                print(f"DEBUG ERROR: Failed to send update email: {e}")

        return instance
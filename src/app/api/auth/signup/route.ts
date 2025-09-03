import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'  // Use singleton
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Signup API called')
    
    // Parse request body safely
    const body = await request.json()
    console.log('📝 Request body parsed:', { email: body.email, hasName: !!body.name })
    
    const { email, name, password } = body

    // Input validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    console.log('🔍 About to check existing user')

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    console.log('✅ Existing user check complete:', !!existingUser)

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    console.log('👤 Creating user')
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        hasCompletedOnboarding: false, // Match your schema
      },
    })

    console.log('🎉 User created successfully:', user.id)

    return NextResponse.json(
      { user: { id: user.id, email: user.email } },
      { status: 201 }
    )

  } catch (error) {
    console.error('❌ Signup error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
